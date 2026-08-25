<?php
/**
 * Настройка e-mail получателя заявок + блок на странице «Заявки».
 * Почта хранится в опции prolatex_lead_email (fallback — admin_email).
 */

namespace Prolatex;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Lead_Settings {

	const OPTION = 'prolatex_lead_email';

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'admin_notices', array( $this, 'render_box' ) );
		add_action( 'admin_post_prolatex_save_lead_email', array( $this, 'save' ) );
	}

	/** Текущая почта для заявок. */
	public static function get_email() {
		$email = get_option( self::OPTION, '' );
		if ( $email && is_email( $email ) ) {
			return $email;
		}
		return get_option( 'admin_email' );
	}

	/** Блок ввода почты над списком заявок. */
	public function render_box() {
		$screen = get_current_screen();
		if ( ! $screen || 'edit-lead' !== $screen->id ) {
			return;
		}
		$email  = self::get_email();
		$saved  = isset( $_GET['plx_mail'] ) && 'saved' === $_GET['plx_mail'];
		?>
		<div class="notice notice-info" style="padding:14px 16px;">
			<h2 style="margin:0 0 8px;">E-mail для заявок</h2>
			<?php if ( $saved ) : ?>
				<p style="color:#1a7f37;margin:0 0 8px;">Почта сохранена.</p>
			<?php endif; ?>
			<p style="margin:0 0 10px;">
				Заявки с сайта отправляются на:
				<strong><?php echo esc_html( $email ); ?></strong>
			</p>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
				<input type="hidden" name="action" value="prolatex_save_lead_email" />
				<?php wp_nonce_field( 'prolatex_lead_email' ); ?>
				<input type="email" name="prolatex_lead_email" value="<?php echo esc_attr( $email ); ?>"
					placeholder="mail@example.com" style="min-width:280px;" required />
				<button type="submit" class="button button-primary">Сохранить почту</button>
			</form>
		</div>
		<?php
	}

	/** Сохранение почты. */
	public function save() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Недостаточно прав.' );
		}
		check_admin_referer( 'prolatex_lead_email' );
		$email = sanitize_email( wp_unslash( $_POST['prolatex_lead_email'] ?? '' ) );
		if ( is_email( $email ) ) {
			update_option( self::OPTION, $email );
		}
		wp_safe_redirect( admin_url( 'edit.php?post_type=lead&plx_mail=saved' ) );
		exit;
	}
}
